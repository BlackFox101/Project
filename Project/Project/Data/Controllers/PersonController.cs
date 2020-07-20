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
        public async Task<IActionResult> Edit(Person person)
        {
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
            return RedirectToAction("ViewVacations", new { id = vac.PersonId });
        }
        public async Task<IActionResult> ViewVacations(int? id)
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
        [HttpPut]
        public async Task<IActionResult> DelVacation(int? id)
        {
            if (id != null)
            {
                Vacation vac = await db.Vacations.FirstOrDefaultAsync(p => p.Id == id);
                int? PersonId = vac.PersonId;
                db.Vacations.Remove(vac);
                await db.SaveChangesAsync();
                return Ok(PersonId);
            }
            return NotFound();
        }

        public async Task<IActionResult> EditVacation(int? id)
        {
            if (id != null)
            {
                var person = db.Vacations
                       .Include(c => c.Person) // добавляем данные по отпускам
                       .ToList();
                Vacation vac = await db.Vacations.FirstOrDefaultAsync(p => p.Id == id);
                if (vac != null)
                {
                    return View(vac);
                }
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> EditVacation(Vacation vac)
        {
            db.Vacations.Update(vac);
            await db.SaveChangesAsync();
            return RedirectToAction("ViewVacations", new { id = vac.PersonId });
        }

        [HttpPost] 
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
        public async Task<IActionResult> AddSprintHours(int? id, [FromBody] int sprint, SprintHour hour)
        {
            if (id != null)
            {
                hour.Id = 0;
                hour.Hours = 0;
                hour.Sprint = sprint;
                hour.PersonId = id;
                db.SprintHours.Add(hour);
                await db.SaveChangesAsync();
                if (hour != null)
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
                Console.WriteLine("PersonId: " + sprintHour.PersonId + ", Sprint: " + sprintHour.Sprint);
                Console.WriteLine();
                if (sprintHour != null)
                {
                    db.SprintHours.Remove(sprintHour);
                    await db.SaveChangesAsync();
                    return Ok();
                }
            }
            return NotFound();
        }
    }
}
