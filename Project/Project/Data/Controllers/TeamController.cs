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
    }
}

