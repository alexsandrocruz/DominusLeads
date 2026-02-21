namespace Sapienza.Leads.Sequences;

public enum ExecutionStatus
{
    Pending = 1,
    Running = 2,
    WaitingReply = 3,
    WaitingDelay = 4,
    Paused = 5,
    Completed = 6,
    Failed = 7,
    Cancelled = 8
}
