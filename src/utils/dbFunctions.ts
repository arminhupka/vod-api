import mongoose from 'mongoose';

export const connection = async (): Promise<typeof mongoose> => {
  mongoose.set('strictQuery', true);
  return await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 10 });
};

export const resetInvoicesCounter = async (): Promise<void> => {
  const db = await connection();

  const counters = db.connection.collection('counters');
  await counters.findOneAndUpdate(
    {
      id: 'orderNumber',
    },
    { $set: { seq: 0 } },
  );

  await db.disconnect();
};
