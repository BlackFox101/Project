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
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private AppDBContext db;
        public TeamController(AppDBContext context)
        {
            db = context;
        }

        // GET: api/People
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            return await db.Teams.ToListAsync();
        }

        // GET: api/People/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var team = await db.Teams.FindAsync(id);

            if (team == null)
            {
                return NotFound();
            }

            return team;
        }

        // PUT: api/People/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeam(int id, Team team)
        {
            if (id != team.Id)
            {
                return BadRequest();
            }

            db.Entry(team).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/People
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Team>> PostTeam(Team team)
        {
            db.Teams.Add(team);
            await db.SaveChangesAsync();

            return CreatedAtAction("GetPerson", new { id = team.Id }, team);
        }

        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IEnumerable<Team>>> DeleteTeam(int id)
        {
            var team = await db.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            db.Teams.Remove(team);
            await db.SaveChangesAsync();

            return await db.Teams.ToListAsync();
        }

        private bool TeamExists(int id)
        {
            return db.Teams.Any(e => e.Id == id);
        }
        /*public async Task<IActionResult> Index()
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
        }*/
    }
}

