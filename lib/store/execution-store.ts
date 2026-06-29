import { create } from 'zustand'

export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed'

export interface Execution {
  id: string
  userId: string
  workflowName: string
  status: ExecutionStatus
  input: Record<string, unknown>
  output: string
  prompt: string
  modelName: string
  tokensUsed: number
  executionTime: number
  createdAt: string
  updatedAt: string
}

interface ExecutionState {
  executions: Execution[]
  currentExecution: Execution | null
  isSubmitting: boolean
  setExecutions: (executions: Execution[]) => void
  setCurrentExecution: (execution: Execution | null) => void
  addExecution: (execution: Execution) => void
  setSubmitting: (v: boolean) => void
}

export const useExecutionStore = create<ExecutionState>()((set) => ({
  executions: [],
  currentExecution: null,
  isSubmitting: false,
  setExecutions: (executions) => set({ executions }),
  setCurrentExecution: (currentExecution) => set({ currentExecution }),
  addExecution: (execution) =>
    set((state) => ({ executions: [execution, ...state.executions] })),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
}))
