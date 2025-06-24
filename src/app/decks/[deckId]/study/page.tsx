// src/app/decks/[deckId]/study/page.tsx

import StudyModePage from './StudyModeClient';

interface PageProps {
  params: {
    deckId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <StudyModePage deckId={params.deckId} />;
}
