import {
    FiCheckCircle,
    FiFileText,
    FiUpload,
} from "react-icons/fi";

const DocumentsSection = ({ role }) => {
    const documents =
        role === "driver"
            ? [
                  {
                      title: "Driving License - Front",
                      status: "Verified",
                  },
                  {
                      title: "Driving License - Back",
                      status: "Verified",
                  },
              ]
            : [
                  {
                      title: "National ID / Passport",
                      status: "Pending",
                  },
                  {
                      title: "Driving License",
                      status: "Pending",
                  },
              ];

    return (
        <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
            <div>
                <h3 className="text-lg font-semibold text-[#F9FAFB]">
                    Documents
                </h3>

                <p className="mt-1 text-sm text-[#9CA3AF]">
                    Manage your uploaded documents and verification status.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {documents.map((document) => (
                    <div
                        key={document.title}
                        className="rounded-2xl border border-white/5 bg-[#0B0C10]/60 p-4"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#9CA3AF]">
                                    <FiFileText size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-[#F9FAFB]">
                                        {document.title}
                                    </p>

                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#10B981]">
                                        <FiCheckCircle size={13} />
                                        {document.status}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#1F2937] px-4 py-2.5 text-sm font-medium text-[#F9FAFB] transition hover:bg-white/10"
                        >
                            <FiUpload size={16} />
                            Upload / Replace
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DocumentsSection;