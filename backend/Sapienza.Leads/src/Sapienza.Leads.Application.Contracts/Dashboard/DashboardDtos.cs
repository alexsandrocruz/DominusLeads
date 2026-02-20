using System;
using System.Collections.Generic;

namespace Sapienza.Leads.Dashboard;

public class DashboardDto
{
    public DashboardStatsDto Stats { get; set; } = new();
    public List<LeadEvolutionDto> Evolution { get; set; } = new();
    public List<RecentActivityDto> RecentActivities { get; set; } = new();
}

public class DashboardStatsDto
{
    public int TotalLeads { get; set; }
    public int LeadsThisMonth { get; set; }
    public decimal CreditsBalance { get; set; }
    public int ActiveSearches { get; set; }
    public double ConversionRate { get; set; }
}

public class LeadEvolutionDto
{
    public string Period { get; set; } = null!;
    public int Count { get; set; }
}

public class RecentActivityDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime Timestamp { get; set; }
    public string? Color { get; set; }
    public string? Icon { get; set; }
}
