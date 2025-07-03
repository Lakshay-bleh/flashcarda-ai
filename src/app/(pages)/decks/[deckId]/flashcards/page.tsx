import FlashcardReviewPage from './FlashcardComponent';

export default async function Page({
    params
  }: {
    params: Promise<{ deckId: string }>;
  }) {
  const resolvedParams = await params;
  return <FlashcardReviewPage params={resolvedParams} />;
}
