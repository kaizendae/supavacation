import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
    // check if user owns the home trying to edit
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { listedHomes: true },
    });
    const { id } = req.query;
    if (!user?.listedHomes?.find(home => home.id === id)) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
    // Update home
    if (req.method === 'PATCH') {
        try {
            const home = await prisma.home.update({
              where: { id },
              data: req.body,
            });
            res.status(200).json(home);
          } catch (e) {
            res.status(500).json({ message: 'Something went wrong' });
          }
    }
    if (req.method === 'DELETE') {
        try {
            const home = await prisma.home.delete({
              where: { id },
            });
            if (home.image) {
                const path = home.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1];
                await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([path]);
              }
            res.status(200).json(home);
          } catch (e) {
            res.status(500).json({ message: `Something went wrong ${e}` });
          }
    }
    // HTTP method not supported!
    else {
      res.setHeader('Allow', ['PATCH', 'DELETE']);
      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  }