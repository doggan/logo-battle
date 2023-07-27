import { ClientSession } from 'mongodb';

/**
 * Helper method for running a transaction. If the closure returns true, the transaction
 * will be committed. Otherwise, it will be aborted.
 */
export async function withTransaction(
  session: ClientSession,
  closure: () => Promise<boolean>,
) {
  await session.withTransaction(async () => {
    const didSucceed = await closure();

    if (!didSucceed) {
      await session.abortTransaction();
    }
  });
}
