import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res){
    // Get the home's onwer
    if(req.method === 'GET'){
        console.log(req.query)
        try{
            const {id} = req.query;
            console.log(id);
            const owner = await prisma.home.findUnique({
                where: {id},
                select: {owner: true},
            })
            res.status(200).json(owner);
        } catch(e) {
            res.status(500).json({message: 'something went wrong'})
        }
    } else {
        res.setHeader('Allow',['GET']);
        res.status(405).json({message: `HTTP method ${req.method} is not supported.`})
    }
}