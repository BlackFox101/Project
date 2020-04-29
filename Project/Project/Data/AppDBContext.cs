using Microsoft.EntityFrameworkCore;
using Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Data
{
    public class AppDBContext : DbContext
    {
        public DbSet<Person> Persons { get; set; }
        public DbSet<Team> Teams { get; set; }
        public AppDBContext(DbContextOptions<AppDBContext> options)
            : base(options)
        {
            Database.EnsureCreated();   // создаем базу данных при первом обращении
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>()
                .HasOne(p => p.Team)
                .WithMany(t => t.Persons)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
