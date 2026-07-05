import prisma from "../src/db/prisma";

async function seeding(){
    const subscriptionPlanSeed = await prisma.subscriptionPlan.createMany({
    data:[
        {
        plan_name:"Starter",
        description:"Starter Plan for small uses",
        price:500.00,
        storage_limit:5,
        billing_cycle:2

    },
    {
        plan_name:"Professional",
        description:"Professional Plan for chains",
        price:1200.00,
        storage_limit:10,
        billing_cycle:3

    },
    {
        plan_name:"Enterprise",
        description:"Enterprise Plan for Large enterprise",
        price:3000.00,
        storage_limit:30,
        billing_cycle:4

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