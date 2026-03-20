import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/lib/api";

export const useQuestions = (userId: string | null | undefined) => {
  return useMutation({
    mutationFn: async (topic: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data: jobInfo } = await aiApi.generateQuestions({ topic });
      const jobId = jobInfo.jobId;

      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const { data: status } = await aiApi.getJobStatus(jobId);
            if (status.state === "completed") {
              clearInterval(interval);
              resolve(status.result.questions);
            } else if (status.state === "failed") {
              clearInterval(interval);
              reject(new Error(status.failedReason || "Generation failed"));
            }
          } catch (err) {
            clearInterval(interval);
            reject(err);
          }
        }, 1000);
      });
    },
  });
};
