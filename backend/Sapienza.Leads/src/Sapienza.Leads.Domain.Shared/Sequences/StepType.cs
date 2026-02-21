namespace Sapienza.Leads.Sequences;

public enum StepType
{
    SendMessage = 1,
    WaitForReply = 2,
    Wait = 3,
    ClassifyResponse = 4,
    UpdateStatus = 5,
    AddNote = 6,
    Condition = 7
}
