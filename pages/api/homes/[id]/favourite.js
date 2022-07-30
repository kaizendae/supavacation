import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
    // const session = await getSession({ req });
    // if (!session) {
    //     return res.status(401).json({ message: 'Unauthorized.' });
    // }
    let session= {user: {email : 'thegeekstudent@gmail.com'}}

    // TODO: Retrieve home ID from request
    const { id } = req.query;

    // const user = await prisma.user.findUnique({
    //     where: { email: session.user.email },
    //     select: { listedHomes: true },
    // });
    // TODO: Add home to favorite
    if (req.method === 'PUT') {
        try{
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: session.user.email,
                },
              });
            console.log(user);
            console.log(prisma.userFavourite);
            const userFavourites = await prisma.userFavourite.create({
                data: {
                    userId: user.id,
                    homeId: id,
                    assignedBy: user.email,
                },
            });
            const favouriteHomes = await prisma.home.findMany({
                where: {
                    users: {
                        some: {
                            user: {
                                id: user.id
                            }
                        }
                    }
                }
            })
            console.log(favouriteHomes);
            res.status(200).json(favouriteHomes);
        } catch(e) {
            res.status(500).json({message: `something went wrong ${e}`})
        }
        
    }
    // TODO: Remove home from favorite
    else if (req.method === 'DELETE') {
        //...
    }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}