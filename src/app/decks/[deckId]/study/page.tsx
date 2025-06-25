import StudyModePage from './StudyModeClient';

interface PageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { deckId } = await params; // correct placement
  return <StudyModePage deckId={deckId} />;
}
