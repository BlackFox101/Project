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
    public class TimeTableController : Controller
    {
        private AppDBContext db;
        public TimeTableController(AppDBContext context)
        {
            db = context;
        }
        public async Task<IActionResult> List(int? id)
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
        public async Task<IActionResult> Edit(Team team)
        {
            db.Teams.Update(team);
            await db.SaveChangesAsync();
            return RedirectToAction("TimeTable", new { id = team.Id });
        }
    }
}
