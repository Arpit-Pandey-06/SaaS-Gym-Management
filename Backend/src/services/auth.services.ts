import prisma from "../db/prisma.ts";
import AuthRepository from "../repository/Auth.repository.ts";
import {
  hashPassword,
  passwordVerify,
  RefreshTokenHashing,
  RefreshTokenCompare,
} from "../utils/passwordHash.utils.ts";
import {
  AccessToken,
  RefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils.ts";
import { Role } from "../generated/prisma/enums.ts";
import { cookie } from "express-validator";

class AuthService {
  async ownerRegister(data: any) {
    const existing_user = await AuthRepository.findUserByEmail(data.email);
    if (existing_user) {
      throw new Error("User is existing");
    }
    const hashedpassword = await hashPassword(data.password);
    delete data.password;
    const subscriptionId =
      await AuthRepository.FindSubscriptionByPlan("Starter");
    if (!subscriptionId) {
      throw new Error("susbscription plan not exist ");
    }
    const result = await prisma.$transaction(async (tx) => {
      const user = await AuthRepository.createUser(tx, {
        full_name: data.full_name,
        email: data.email,
        password_hash: hashedpassword,
        role: Role.Owner,
      });
      const gym = await AuthRepository.createGym(tx, {
        gym_name: data.gym_name,
        userId: user.id,
        business_email: data.business_email,
      });
      const gymSubscription = await AuthRepository.createSubscription(tx, {
        subscription_plan_id: subscriptionId.id,
        gymId: gym.id,
      });
      return {
        user,
        gym,
        gymSubscription,
      };
    });
    const {
      password_hash,
      created_at,
      updated_at,
      phone_number,
      ...userwithoupassword
    } = result.user;
    return userwithoupassword;
  }

  async login(data: any) {
    const existing = await AuthRepository.findUserByEmail(data.email);
    if (!existing) {
      throw new Error("Email or Password are invalid");
    }

    if (existing.account_status !== "ACTIVE") {
      throw new Error("Account Credential not Satisfied");
    }
    const correctPassword = await passwordVerify(
      existing.password_hash,
      data.password,
    );
    if (!correctPassword) {
      throw new Error("Email or Password are invalid");
    }

    const accessToken = AccessToken({
      id: existing.id,
      role: existing.role,
      email: existing.email,
      status: existing.account_status,
    });
    const refreshToken = RefreshToken({
      id: existing.id,
      role: existing.role,
      email: existing.email,
      status: existing.account_status,
    });

    const hash_RefreshToken = await RefreshTokenHashing(refreshToken);
    await AuthRepository.RefreshTokenSave({
      token_hash: hash_RefreshToken,
      userId: existing.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    const { password_hash, created_at, updated_at, ...userWithoutPassword } =
      existing;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userWithoutPassword,
    };
  }

  async AccesstokenReGenration(data: string) {
    const refresh = data;

    const payload = verifyRefreshToken(refresh);

    const user = await AuthRepository.FindUserById(payload);

    if (!user) {
      throw new Error("401 Unauthorized access");
    }

    if (user.account_status !== "ACTIVE") {
      throw new Error("401 Unauthorized access account invalid status ");
    }

    const access_token_regenrated = AccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
      status: user.account_status,
    });

    return access_token_regenrated;
  }

  async getCurrentUser(user_id: string) {
    const user_info = await AuthRepository.FindUserById(user_id);
    if (!user_info) {
      return {
        success: false,
        msg: "User not Exist",
      };
    }
    const {
      password_hash,
      updated_at,
      created_at,
      phone_number,
      ...remaingvalue
    } = user_info;

    return {
      success: true,
      data: remaingvalue,
    };
  }

  async logout(token:string){
    const verified_id = await verifyRefreshToken(token)
    const user = await AuthRepository.FindUserById(verified_id)
    await AuthRepository.DeleteRefreshToken(verified_id)
    return {
        success:true
    }

  }

}

export default new AuthService();
