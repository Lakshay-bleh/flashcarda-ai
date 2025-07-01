// src/app/(pages)/decks/[deckId]/study/page.tsx

import StudyModePage from './StudyModeClient';

interface PageProps {
  params: Promise<{ deckId: string }>; // or just: { deckId: string }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <StudyModePage deckId={resolvedParams.deckId} />;
}
