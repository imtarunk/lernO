import Sidebar from "@/components/sidebar";

const LearningLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full ">
      <Sidebar />
      <div className="w-full ml-24">{children}</div>
    </div>
  );
};

export default LearningLayout;
