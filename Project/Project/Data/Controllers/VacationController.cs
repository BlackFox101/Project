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
    public class VacationController : Controller
    {
        private AppDBContext db;
        public VacationController(AppDBContext context)
        {
            db = context;
        }
        public IActionResult Add(int? id)
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
        public async Task<IActionResult> Add(Vacation vac)
        {
            db.Vacations.Add(vac);
            await db.SaveChangesAsync();
            return RedirectToAction("List", new { id = vac.PersonId });
        }
        public async Task<IActionResult> List(int? id)
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
        public async Task<IActionResult> Delete(int? id)
        {
            if (id != null)
            {
                Vacation vac = await db.Vacations.FirstOrDefaultAsync(p => p.Id == id);
                db.Vacations.Remove(vac);
                await db.SaveChangesAsync();
                return RedirectToAction("List", new { id = vac.PersonId });
            }
            return NotFound();
        }

        [HttpPut]
        public async Task<IActionResult> Edit(int? id, [FromBody] string data)
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
    }
}
