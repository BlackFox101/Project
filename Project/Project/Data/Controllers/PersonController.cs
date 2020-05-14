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
    public class PersonController : Controller
    {
        private AppDBContext db;
        public PersonController(AppDBContext context)
        {
            db = context;
        }
        public async Task<IActionResult> Index()
        {
            var person = db.Persons
                        .Include(c => c.Team)  // добавляем данные по командам
                        .ToList();
            return View(await db.Persons.ToListAsync());
        }
        public IActionResult Create()
        {
            SelectList teams = new SelectList(db.Teams, "Id", "Title");
            ViewBag.Teams = teams;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(Person user)
        {
            db.Persons.Add(user);
            Console.WriteLine("id=" + user.Id + " PersonId=" + user.Name);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }
        public async Task<IActionResult> Details(int? id)
        {
            if (id != null)
            {
                var person = db.Persons
                        .Include(c => c.Team)  // добавляем данные по команде
                        .Include(c => c.Vacations) // добавляем данные по отпускам
                        .ToList();
                Person user = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (user != null)
                    return View(user);
            }
            return NotFound();
        }
        public async Task<IActionResult> Edit(int? id)
        {
            if (id != null)
            {
                SelectList teams = new SelectList(db.Teams, "Id", "Title");
                ViewBag.Teams = teams;
                Person user = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (user != null)
                    return View(user);
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> Edit(Person user)
        {
            db.Persons.Update(user);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        [HttpGet]
        [ActionName("Delete")]
        public async Task<IActionResult> ConfirmDelete(int? id)
        {
            if (id != null)
            {
                var person = db.Persons
                        .Include(c => c.Team)  // добавляем данные по пользователям
                        .ToList();
                Person user = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
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
                Person user = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (user != null)
                {
                    db.Persons.Remove(user);
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
                Person user = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (user.Duty == 1)
                {
                    user.Duty = 0;
                }
                else
                {
                    user.Duty = 1;
                }
                await db.SaveChangesAsync();
                if (user != null)
                    return Ok(user.Duty);
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
        public async Task<IActionResult> AddVacation(Vacation item)
        {
            db.Vacations.Add(item);
            Console.WriteLine("id=" + item.Id + " PersonId=" + item.PersonId);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }
        public async Task<IActionResult> ViewVacations(int? id)
        {
            if (id != null)
            {
                var person = db.Persons
                        .Include(c => c.Vacations) // добавляем данные по отпускам
                        .ToList();
                Person user = await db.Persons.FirstOrDefaultAsync(p => p.Id == id);
                if (user != null)
                    return View(user);
            }
            return NotFound();
        }
    }
}
