using Microsoft.EntityFrameworkCore;
using Project.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project.Data
{
    public class AppDBContext : DbContext
    {
        public DbSet<Vacation> Vacations { get; set; }
        public DbSet<SprintHour> SprintHours { get; set; }
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
            modelBuilder.Entity<Vacation>()
                .HasOne(p => p.Person)
                .WithMany(t => t.Vacations)
                .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<SprintHour>()
                .HasOne(p => p.Person)
                .WithMany(t => t.SprintHours)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Team>().HasData(
            new Team[]
            {
                new Team { Id=1, Title="Google", DutyDuration=1, FirstPersonInDutyId=1, DutyStartDate=new DateTime(2020, 05, 04), Sprints=3},
                new Team { Id=2, Title="Microsoft", DutyDuration=2, FirstPersonInDutyId=1, DutyStartDate=new DateTime(2020, 05, 04), Sprints=1},
                new Team { Id=3, Title="CD Project RED", DutyDuration=5, FirstPersonInDutyId=1, DutyStartDate=new DateTime(2020, 05, 04), Sprints=1}
            });

            modelBuilder.Entity<Person>().HasData(
            new Person[]
            {
                new Person { Id=1, Name="Половцев Эдуард Агапович", Position="Разработчик", Duty=true, TeamId=1, Coefficient=0.2},
                new Person { Id=2, Name="Яндульский Иван Кондратьевич", Position="Разработчик", Duty=true, TeamId=1, Coefficient=0.4},
                new Person { Id=3, Name="Иванов Иван Иванович", Position="Разработчик", Duty=true, TeamId=1, Coefficient=0.6},
                new Person { Id=4, Name="Янович Руслан Савелиевич", Position="Тестировщик", Duty=false, TeamId=1, Coefficient=0.8},
                new Person { Id=5, Name="Циркунов Руслан Олегович", Position="Тестировщик", Duty=true, TeamId=1, Coefficient=1},
                new Person { Id=6, Name="Арефьев Захар Пахомович", Position="Тестировщик", Duty=false, TeamId=2, Coefficient=1},
                new Person { Id=7, Name="Яробкин Феликс Куприянович", Position="Разработчик", Duty=false, TeamId=2, Coefficient=1},
                new Person { Id=8, Name="Ковалев Мстислав Маркович", Position="Тестировщик", Duty=false, TeamId=3, Coefficient=1}
            });

            modelBuilder.Entity<SprintHour>().HasData(
            new SprintHour[]
            {
                new SprintHour { Id=1, Hours=1, Sprint=1, PersonId=1},
                new SprintHour { Id=2, Hours=2, Sprint=1, PersonId=2},
                new SprintHour { Id=3, Hours=3, Sprint=1, PersonId=3},
                new SprintHour { Id=4, Hours=4, Sprint=1, PersonId=4},
                new SprintHour { Id=5, Hours=5, Sprint=1, PersonId=5},

                new SprintHour { Id=6, Hours=1, Sprint=2, PersonId=1},
                new SprintHour { Id=7, Hours=2, Sprint=2, PersonId=2},
                new SprintHour { Id=8, Hours=3, Sprint=2, PersonId=3},
                new SprintHour { Id=9, Hours=4, Sprint=2, PersonId=4},
                new SprintHour { Id=10, Hours=5, Sprint=2, PersonId=5},

                new SprintHour { Id=11, Hours=1, Sprint=3, PersonId=1},
                new SprintHour { Id=12, Hours=2, Sprint=3, PersonId=2},
                new SprintHour { Id=13, Hours=3, Sprint=3, PersonId=3},
                new SprintHour { Id=14, Hours=4, Sprint=3, PersonId=4},
                new SprintHour { Id=15, Hours=5, Sprint=3, PersonId=5}
            });
        }
    }
}
