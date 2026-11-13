import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router";

const CatchItems = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/lessons/${lessonId}`);
  };

  return (
    <section className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <p className="mb-2 text-7xl font-black uppercase text-accent">
            ParaWords
          </p>
          <p className="text-2xl text-primary">
            Coming Soon
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-8 inline-flex cursor-pointer items-center gap-1 text-sm 
            font-semibold text-secondary transition-colors hover:text-primary-color"
          >
            <ArrowLeft aria-hidden="true" size={18} /> Back to lesson
          </button>
        </div>
      </div>
    </section>
  )
}

export default CatchItems