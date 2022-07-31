import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
    // const session = await getSession({ req });
    // if (!session) {
    //     return res.status(401).json({ message: 'Unauthorized.' });
    // }
    let session= {user: {email : 'thegeekstudent@gmail.com', id:'cl66gnjej0030nq9kn86vh4ip'}}

    // TODO: Retrieve home ID from request
    const { id } = req.query;

    // const user = await prisma.user.findUnique({
    //     where: { email: session.user.email },
    //     select: { listedHomes: true },
    // });
    // TODO: Add home to favorite
    if (req.method === 'PUT') {
        try{
            const userFavourites = await prisma.userFavourite.create({
                data: {
                    userId: session.user.id,
                    homeId: id,
                    assignedBy: session.user.email,
                },
            });
            const favouriteHomes = await prisma.home.findMany({
                where: {
                    users: {
                        some: {
                            user: {
                                id: session.user.id
                            }
                        }
                    }
                }
            })
            res.status(200).json(favouriteHomes);
        } catch(e) {
            res.status(500).json({message: `something went wrong ${e}`})
        }
        
    }
    else if (req.method === 'DELETE') {
        try{
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: session.user.email,
                },
              });
            console.log(user);
            console.log(prisma.userFavourite);
            const deletedUserFavourite = await prisma.userFavourite.delete({
                where: {
                    userId_homeId: {
                          userId: session.user.id,
                          homeId: id
                        },
                },
            });
            res.status(200).json(deletedUserFavourite);
        } catch(e) {
            res.status(500).json({message: `something went wrong ${e}`})
        }
    }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}