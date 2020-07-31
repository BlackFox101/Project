using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Data.Models;

namespace Project.Data.Controllers
{
    public class CoefficientsController : Controller
    {
        private AppDBContext db;
        public CoefficientsController(AppDBContext context)
        {
            db = context;
        }
        public async Task<IActionResult> List(int? id)
        {
            if (id != null)
            {
                var persons = db.Persons
                        .Include(c => c.SprintHours)  // добавляем данные по отпускам
                        .ToList();
                var teams = db.Teams
                        .Include(c => c.Persons)  // добавляем данные по пользователям
                        .ToList();
                Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (team != null)
                {
                    return View(team);
                }
            }
            return NotFound();
        }
        [HttpPut]
        public async Task<IActionResult> ChangeSprints(int? id, [FromBody] int Sprints)
        {
            if (id != null)
            {
                Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                team.Sprints = Sprints;
                await db.SaveChangesAsync();
                if (team != null)
                {
                    return Ok(team.Sprints);
                }
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> AddSprintHours(int? id, [FromBody] int sprint)
        {
            if (id != null)
            {
                SprintHour sprintHour = new SprintHour
                {
                    Hours = 0,
                    Sprint = sprint,
                    PersonId = id,
                };
                db.SprintHours.Add(sprintHour);
                await db.SaveChangesAsync();
                if (sprintHour != null)
                {
                    return Ok();
                }
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> DelSprintHours(int? id, [FromBody] int sprint)
        {
            if (id != null)
            {
                SprintHour sprintHour = await db.SprintHours.FirstOrDefaultAsync(p => (p.PersonId == id && p.Sprint == sprint));
                if (sprintHour != null)
                {
                    db.SprintHours.Remove(sprintHour);
                    await db.SaveChangesAsync();
                    return Ok();
                }
            }
            return NotFound();
        }
        [HttpPut]
        public async Task<IActionResult> EditFactor(int? id, [FromBody] double Coefficient)
        {
            if (id != null)
            {
                Person person = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                person.Coefficient = Coefficient;
                await db.SaveChangesAsync();
                if (person != null)
                {
                    return Ok(person.Coefficient);
                }
            }
            return NotFound();
        }
        [HttpPut]
        public async Task<IActionResult> EditHour(int? id, [FromBody] string data)
        {
            if (id != null)
            {
                SprintHour dataJson = JsonSerializer.Deserialize<SprintHour>(data);
                SprintHour SprintHour = await db.SprintHours.FirstOrDefaultAsync(p => (p.PersonId == id && p.Sprint == dataJson.Sprint));
                SprintHour.Hours = dataJson.Hours;
                await db.SaveChangesAsync();
                if (data != null)
                {
                    return Ok(SprintHour.Hours);
                }
            }
            return NotFound();
        }
    }
}
