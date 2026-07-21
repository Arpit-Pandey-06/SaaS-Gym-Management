import prisma from "../src/db/prisma";

async function seeding(){
    const subscriptionPlanSeed = await prisma.subscriptionPlan.createMany({
    data:[
        {
        plan_name:"Starter",
        description:"Starter Plan for small uses",
        monthly_price:500.00,
        max_branches:4,
        max_managers:5,
        max_trainers:5,
        max_members:1000,
        storage_limit:5,
        billing_cycle:2,


    },
    {
        plan_name:"Professional",
        description:"Professional Plan for chains",
        monthly_price:1200.00,
        max_branches:10,
        max_managers:12,
        max_trainers:18,
        max_members:8000,
        storage_limit:10,
        billing_cycle:2,

    },
    {
        plan_name:"Enterprise",
        description:"Enterprise Plan for Large enterprise",
        monthly_price:2000.00,
        max_branches:12,
        max_managers:14,
        max_trainers:16,
        max_members:9000,
        storage_limit:12,
        billing_cycle:2,

    }
],
skipDuplicates:true

})

console.log("seeding complete")
}



seeding()
    .catch(console.error)
    .finally(async()=>{
        await prisma.$disconnect();
    })