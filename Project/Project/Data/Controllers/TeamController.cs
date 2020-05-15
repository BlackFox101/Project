using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        [ActionName("Delete")]
        public async Task<IActionResult> ConfirmDelete(int? id)
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
        public async Task<IActionResult> Edit(Team user)
        {
            db.Teams.Update(user);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
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
    }
}

