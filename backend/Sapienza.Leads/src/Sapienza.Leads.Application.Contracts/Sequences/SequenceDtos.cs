using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Sapienza.Leads.Sequences;

public class SequenceDto : EntityDto<Guid>
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool IsActive { get; set; }
    public List<SequenceStepDto> Steps { get; set; } = new();
    public int ExecutionCount { get; set; }
}

public class SequenceStepDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
    public StepType Type { get; set; }
    public string? Config { get; set; }
}

public class CreateUpdateSequenceDto
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool IsActive { get; set; }
    public List<CreateUpdateSequenceStepDto> Steps { get; set; } = new();
}

public class CreateUpdateSequenceStepDto
{
    public int Order { get; set; }
    public StepType Type { get; set; }
    public string? Config { get; set; }
}

public class SequenceExecutionDto : EntityDto<Guid>
{
    public Guid SequenceId { get; set; }
    public string SequenceName { get; set; } = string.Empty;
    public Guid LeadId { get; set; }
    public string LeadName { get; set; } = string.Empty;
    public int CurrentStepIndex { get; set; }
    public int TotalSteps { get; set; }
    public ExecutionStatus Status { get; set; }
    public DateTime? NextActionAt { get; set; }
    public string? LastClassification { get; set; }
    public string? LastReply { get; set; }
    public DateTime CreationTime { get; set; }
    public List<StepExecutionDto> StepExecutions { get; set; } = new();
}

public class StepExecutionDto
{
    public Guid Id { get; set; }
    public int StepIndex { get; set; }
    public StepExecutionStatus Status { get; set; }
    public DateTime ExecutedAt { get; set; }
    public string? Result { get; set; }
}
