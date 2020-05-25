﻿using System;
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
            await db.SaveChangesAsync();
            return RedirectToAction("ViewVacations", new { id = item.PersonId });
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
        [HttpPut]
        public async Task<IActionResult> DelVacation(int? id)
        {
            if (id != null)
            {
                Vacation user = await db.Vacations.FirstOrDefaultAsync(p => p.Id == id);
                int? PersonId = user.PersonId;
                db.Vacations.Remove(user);
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
                Vacation item = await db.Vacations.FirstOrDefaultAsync(p => p.Id == id);
                if (item != null)
                    return View(item);
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> EditVacation(Vacation item)
        {
            db.Vacations.Update(item);
            await db.SaveChangesAsync();
            return RedirectToAction("ViewVacations", new { id = item.PersonId });
        }
    }
}
