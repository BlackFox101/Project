using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Project.Data.Models;

namespace Project.Data.Controllers
{
    public class PersonController : Controller
    {
        private AppDBContext db;
        public PersonController(AppDBContext context)
        {
            db = context;
        }
        public async Task<IActionResult> Index()
        {
            return View(await db.Persons.Include(c => c.Team).ToListAsync());
        }
        public IActionResult Create()
        {
            SelectList teams = new SelectList(db.Teams, "Id", "Title");
            ViewBag.Teams = teams;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(Person person)
        {
            db.Persons.Add(person);
            await db.SaveChangesAsync();
            Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == person.TeamId);
            int sprints = team.Sprints;
            for (int i = 1; i <= sprints; i++)
            {
                SprintHour sprint = new SprintHour
                {
                    Hours = 0,
                    Sprint = i,
                    PersonId = person.Id,
                };
                db.SprintHours.Add(sprint);
            }
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }
        public async Task<IActionResult> Details(int? id)
        {
            if (id != null)
            {
                var teams = db.Persons
                        .Include(c => c.Team)  // добавляем данные по команде
                        .Include(c => c.Vacations) // добавляем данные по отпускам
                        .ToList();
                Person person = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (person != null)
                {
                    return View(person);
                }
            }
            return NotFound();
        }
        public async Task<IActionResult> Edit(int? id)
        {
            if (id != null)
            {
                SelectList teams = new SelectList(db.Teams, "Id", "Title");
                ViewBag.Teams = teams;
                Person person = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (person != null)
                {
                    return View(person);
                }
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> Edit(Person person, int lastTeam)
        {
            if (lastTeam != person.TeamId)
            {
                Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == person.TeamId);
                int sprints = team.Sprints;
                int i = 1;
                foreach (SprintHour sprinthour in db.SprintHours.Where(p => p.PersonId == person.Id))
                {
                    if (i <= sprints)
                    {
                        sprinthour.Hours = 0;
                        sprinthour.Sprint = i;
                    }
                    else 
                    {
                        Console.WriteLine();
                        db.SprintHours.Remove(sprinthour);
                    }
                    i++;
                }
                for (int j = i; j <= sprints; j++)
                {
                    SprintHour sprint = new SprintHour
                    {
                        Hours = 0,
                        Sprint = j,
                        PersonId = person.Id,
                    };
                    db.SprintHours.Add(sprint);
                }
            }
            db.Persons.Update(person);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id != null)
            {
                Person person = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (person != null)
                {
                    foreach (SprintHour sprinthour in db.SprintHours.Where(p => p.PersonId == person.Id))
                    {
                        db.SprintHours.Remove(sprinthour);
                    }
                    foreach (Vacation vacation in db.Vacations.Where(p => p.PersonId == person.Id))
                    {
                        db.Vacations.Remove(vacation);
                    }
                    db.Persons.Remove(person);
                    await db.SaveChangesAsync();
                    return RedirectToAction("Index");
                }
            }
            return NotFound();
        }

        [HttpPut]
        public async Task<IActionResult> EditDuty(int? id)
        {
            if (id != null)
            {
                Person person = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (person.Duty == true)
                {
                    person.Duty = false;
                }
                else
                {
                    person.Duty = true;
                }
                await db.SaveChangesAsync();
                if (person != null)
                {
                    return Ok(person.Duty);
                }
            }
            return NotFound();
        }
        public IActionResult AddVacation(int? id)
        {
            if (id != null)
            {
                var person = db.Persons.Find(id);
                ViewBag.Person = person;
                ViewBag.PersonId = id;
                return View();
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> AddVacation(Vacation vac)
        {
            db.Vacations.Add(vac);
            await db.SaveChangesAsync();
            return RedirectToAction("Vacations", new { id = vac.PersonId });
        }
        public async Task<IActionResult> Vacations(int? id)
        {
            if (id != null)
            {
                var vacations = db.Persons
                        .Include(c => c.Vacations) // добавляем данные по отпускам
                        .ToList();
                Person person = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (person != null)
                {
                    return View(person);
                }
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> DelVacation(int? id)
        {
            if (id != null)
            {
                Vacation vac = await db.Vacations.FirstOrDefaultAsync(p => p.Id == id);
                db.Vacations.Remove(vac);
                await db.SaveChangesAsync();
                return RedirectToAction("Vacations", new { id = vac.PersonId });
            }
            return NotFound();
        }

        [HttpPut]
        public async Task<IActionResult> EditVacation(int? id, [FromBody] string data)
        {
            if (id != null)
            {
                Vacation vacJson = JsonSerializer.Deserialize<Vacation>(data);
                Vacation vacation = await db.Vacations.FirstOrDefaultAsync(p => p.Id == id);
                vacation.Reason = vacJson.Reason;
                vacation.StartDate = vacJson.StartDate;
                vacation.EndDate = vacJson.EndDate;
                db.Vacations.Update(vacation);
                await db.SaveChangesAsync();
                return Ok();
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
