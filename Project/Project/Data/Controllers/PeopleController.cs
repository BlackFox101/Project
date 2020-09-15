using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Data;
using Project.Data.Models;
using TempWebApi;

namespace TempWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private AppDBContext db;
        public PeopleController(AppDBContext context)
        {
            db = context;
        }

        // GET: api/People
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPeople()
        {
            return await db.Persons.Include(person => person.Team).ToListAsync();
        }

        // GET: api/People/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var person = await db.Persons.FindAsync(id);

            if (person == null)
            {
                return NotFound();
            }

            return person;
        }

        // PUT: api/People/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson(int id, Person person)
        {
            if (id != person.Id)
            {
                return BadRequest();
            }

            db.Entry(person).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
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
        public async Task<ActionResult<Person>> PostPerson([FromForm]Person per)
        {
            Console.WriteLine(per);
            /*Person person = new Person 
            {
                Name = per.Name,
                Position = per.Position,
                Duty = false,
                TeamId = per.TeamId,
                Coefficient = per.Coefficient
            };
            db.Persons.Add(person);
            await db.SaveChangesAsync();
            Team team = await db.Teams.FirstOrDefaultAsync(p => p.Id == person.TeamId);
            int sprints = team.Sprints;
            for (int i = 1; i <= sprints; i++)
            {
                SprintHour sprint = new SprintHour
                {
                    Hours = 0,
                    Sprint = i,
                    PersonId = person.Id,
                };
                db.SprintHours.Add(sprint);
            }*/
            await db.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IEnumerable<Person>>> DeletePerson(int id)
        {
            var person = await db.Persons.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            db.Persons.Remove(person);
            await db.SaveChangesAsync();

            return await db.Persons.Include(person => person.Team).ToListAsync();
        }

        private bool PersonExists(int id)
        {
            return db.Persons.Any(e => e.Id == id);
        }
    }
}
