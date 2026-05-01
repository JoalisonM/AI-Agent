import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

export const State = Annotation.Root({
  nextNode: Annotation<string>,
  messages: Annotation<BaseMessage[]>({
    reducer: (currentOutput, nextOutput) => currentOutput.concat(nextOutput),
    default: () => [],
  }),
});
