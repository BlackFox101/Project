using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<IActionResult> Create(Team user)
        {
            db.Teams.Add(user);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id != null)
            {
                Team user = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (user != null)
                {
                    db.Teams.Remove(user);
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
                        .Include(c => c.Vacations)  // добавляем данные по пользователям
                        .ToList();
                var team = db.Teams
                        .Include(c => c.Persons)  // добавляем данные по пользователям
                        .ToList();
                Team user = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (user.FirstPersonInDutyId == null)
                {
                    foreach (Person person in user.Persons.Where(c => c.Duty == 1))
                    {
                        user.FirstPersonInDutyId = person.Id;
                        break;
                    }
                }
                if (user != null)
                    return View(user);
            }
            return NotFound();
        }
        public async Task<IActionResult> Edit(int? id)
        {
            if (id != null)
            { 
                Team user = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (user != null)
                    return View(user);
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
                var team = db.Teams
                        .Include(c => c.Persons)  // добавляем данные по пользователям
                        .ToList();
                Team user = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (user != null)
                    return View(user);
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> ExcludeTeam(int? id)
        {
            if (id != null)
            {
                Person user = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                int? team = user.TeamId;
                user.TeamId = null;
                await db.SaveChangesAsync();
                if (user != null)
                    return RedirectToAction("Details", new { id = team });
            }
            return NotFound();
        }
        public async Task<IActionResult> TimeTableEdit(int? id)
        {
            if (id != null)
            {
                SelectList persons = new SelectList(db.Persons.Where(c => c.TeamId == id && c.Duty == 1), "Id", "Name");
                ViewBag.Persons = persons;
                Team user = await db.Teams.FirstOrDefaultAsync(p => p.Id == id);
                if (user != null)
                    return View(user);
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
    }
}

