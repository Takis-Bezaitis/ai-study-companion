type LoadingScreenProps = {
  fullScreen?: boolean;
};

const LoadingScreen = ({
  fullScreen = true,
}: LoadingScreenProps) => (
  <div
    className={`flex items-center justify-center ${
      fullScreen ? "min-h-dvh" : "min-h-64"
    }`}
  >
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600" />
  </div>
);

export default LoadingScreen;