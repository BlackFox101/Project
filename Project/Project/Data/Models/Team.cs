using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<Person> Persons { get; set; }
        public Team()
        {
            Persons = new List<Person>();
        }
    }
}
