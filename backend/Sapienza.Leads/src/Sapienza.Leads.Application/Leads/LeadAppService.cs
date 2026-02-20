using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Sapienza.Leads.Events;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Sapienza.Leads.Leads;

[AllowAnonymous]
public class LeadAppService :
    CrudAppService<
        Lead,
        LeadDto,
        Guid,
        GetLeadsInput,
        CreateUpdateLeadDto>,
    ILeadAppService
{
    private readonly IRepository<Event, Guid> _eventRepository;

    public LeadAppService(
        IRepository<Lead, Guid> repository,
        IRepository<Event, Guid> eventRepository)
        : base(repository)
    {
        _eventRepository = eventRepository;
    }

    protected override async Task<IQueryable<Lead>> CreateFilteredQueryAsync(GetLeadsInput input)
    {
        var query = await base.CreateFilteredQueryAsync(input);

        return query
            .WhereIf(!input.Filter.IsNullOrWhiteSpace(), x => 
                x.RazaoSocial.Contains(input.Filter!) || 
                x.NomeFantasia.Contains(input.Filter!) || 
                x.Cnpj.Contains(input.Filter!))
            .WhereIf(input.Status.HasValue, x => x.Status == input.Status!.Value)
            .WhereIf(!input.Cnae.IsNullOrWhiteSpace(), x => x.CnaePrincipal.Contains(input.Cnae!))
            .WhereIf(!input.Cidade.IsNullOrWhiteSpace(), x => x.Cidade.Contains(input.Cidade!));
    }

    public async Task UpdateStatusAsync(Guid id, LeadStatus status)
    {
        var lead = await Repository.GetAsync(id);
        var oldStatus = lead.Status;
        
        if (oldStatus == status) return;

        lead.SetStatus(status);
        await Repository.UpdateAsync(lead);

        await _eventRepository.InsertAsync(new Event(
            GuidGenerator.Create(),
            lead.Id,
            EventType.MudancaStatus,
            "Mudança de Estágio",
            $"Lead movido de {oldStatus} para {status}",
            Clock.Now,
            "blue",
            "refresh-cw",
            CurrentUser.Id,
            CurrentTenant.Id
        ));
    }

    public async Task AddNoteAsync(Guid id, string content)
    {
        var lead = await Repository.GetAsync(id);

        await _eventRepository.InsertAsync(new Event(
            GuidGenerator.Create(),
            lead.Id,
            EventType.Nota,
            "Nota Manual",
            content,
            Clock.Now,
            "amber",
            "file-text",
            CurrentUser.Id,
            CurrentTenant.Id
        ));
    }

    protected override Task<LeadDto> MapToGetOutputDtoAsync(Lead entity)
    {
        var mapper = new LeadsApplicationMappers();
        return Task.FromResult(mapper.Map(entity));
    }

    protected override Task<Lead> MapToEntityAsync(CreateUpdateLeadDto createInput)
    {
        var lead = new Lead(
            GuidGenerator.Create(),
            createInput.Cnpj,
            createInput.CnaePrincipal,
            createInput.RazaoSocial,
            createInput.NomeFantasia,
            createInput.Status,
            createInput.Score,
            createInput.Origem,
            CurrentTenant.Id
        );

        lead.SetContactInfo(createInput.Email, createInput.Telefone);
        lead.SetAddress(
            createInput.Logradouro,
            createInput.Numero,
            createInput.Bairro,
            createInput.Cidade,
            createInput.Uf,
            createInput.Cep
        );

        return Task.FromResult(lead);
    }

    protected override Task MapToEntityAsync(CreateUpdateLeadDto updateInput, Lead entity)
    {
        var mapper = new LeadsApplicationMappers();
        mapper.Map(updateInput, entity);
        return Task.CompletedTask;
    }
}
