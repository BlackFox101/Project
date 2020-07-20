using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Project.Data.Models;

namespace Project.Data.Controllers
{
    public class TeamController : Controller
    {
        private AppDBContext db;
        public TeamController(AppDBContext context)
        {
            db = context;
        }
        public async Task<IActionResult> Index()
        {
            return View(await db.Teams.ToListAsync());
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(Team team)
        {
            db.Teams.Add(team);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id != null)
            {
                Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (team != null)
                {
                    db.Teams.Remove(team);
                    await db.SaveChangesAsync();
                    return RedirectToAction("Index");
                }
            }
            return NotFound();
        }
        public async Task<IActionResult> TimeTable(int? id)
        {
            if (id != null)
            {
                var persons = db.Persons
                        .Include(c => c.Vacations)  // добавляем данные по отпускам
                        .ToList();
                var teams = db.Teams
                        .Include(c => c.Persons)  // добавляем данные по пользователям
                        .ToList();
                Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (team.FirstPersonInDutyId == null)
                {
                    Person person = team.Persons.FirstOrDefault(c => c.Duty == true);
                    if (person != null)
                    {
                        team.FirstPersonInDutyId = person.Id;
                    }
                }
                if (team != null)
                {
                    return View(team);
                }
            }
            return NotFound();
        }
        public async Task<IActionResult> Edit(int? id)
        {
            if (id != null)
            { 
                Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (team != null)
                {
                    return View(team);
                }
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> Edit(Team team)
        {
            db.Teams.Update(team);
            await db.SaveChangesAsync();
            return RedirectToAction("Details", new { id = team.Id });
        }
        public async Task<IActionResult> Details(int? id)
        {
            if (id != null)
            {
                var persons = db.Teams
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
        [HttpPost]
        public async Task<IActionResult> ExcludeTeam(int? id)
        {
            if (id != null)
            {
                Person person = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                int? team = person.TeamId;
                person.TeamId = null;
                await db.SaveChangesAsync();
                if (person != null)
                {
                    return RedirectToAction("Details", new { id = team });
                }
            }
            return NotFound();
        }
        public async Task<IActionResult> TimeTableEdit(int? id)
        {
            if (id != null)
            {
                SelectList persons = new SelectList(db.Persons.Where(c => c.TeamId == id && c.Duty == true), "Id", "Name");
                ViewBag.Persons = persons;
                Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (team != null)
                {
                    return View(team);
                }
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> TimeTableEdit(Team team)
        {
            db.Teams.Update(team);
            await db.SaveChangesAsync();
            return RedirectToAction("TimeTable", new { id = team.Id });
        }
        public async Task<IActionResult> Coefficients(int? id)
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
        public async Task<IActionResult> СhangeSprints(int? id, [FromBody] int Sprints)
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
    }
}

