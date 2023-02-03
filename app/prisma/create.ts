const {PrismaClient} = require('@prisma/client')

async function main() {
    const prisma = new PrismaClient();
    
    return prisma.contract.create({
        data:{
            address:'0xe3113c749213d330Fd59A177ac10d7e603fCA7ca'
        }
    })
}

main().then(res => console.log('good'));