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

            modelBuilder.Entity<Team>().HasData(
            new Team[]
            {
                new Team { Id=1, Title="Google", DutyDuration=1, FirstPersonInDutyId=1, DutyStartDate=new DateTime(2020, 05, 04)},
                new Team { Id=2, Title="Microsoft", DutyDuration=2, FirstPersonInDutyId=1, DutyStartDate=new DateTime(2020, 05, 04)},
                new Team { Id=3, Title="CD Project RED", DutyDuration=5, FirstPersonInDutyId=1, DutyStartDate=new DateTime(2020, 05, 04)}
            });
            modelBuilder.Entity<Person>().HasData(
            new Person[]
            {
                new Person { Id=1, Name="Половцев Эдуард Агапович", Position="Разработчик", Duty=1, TeamId=1},
                new Person { Id=2, Name="Яндульский Иван Кондратьевич", Position="Разработчик", Duty=1, TeamId=1},
                new Person { Id=3, Name="Иванов Иван Иванович", Position="Разработчик", Duty=1, TeamId=1},
                new Person { Id=4, Name="Янович Руслан Савелиевич", Position="Тестировщик", Duty=0, TeamId=1},
                new Person { Id=5, Name="Циркунов Руслан Олегович", Position="Тестировщик", Duty=1, TeamId=1},
                new Person { Id=6, Name="Арефьев Захар Пахомович", Position="Тестировщик", Duty=0, TeamId=2},
                new Person { Id=7, Name="Яробкин Феликс Куприянович", Position="Разработчик", Duty=0, TeamId=2},
                new Person { Id=8, Name="Ковалев Мстислав Маркович", Position="Тестировщик", Duty=0, TeamId=3}
            });
            modelBuilder.Entity<Vacation>().HasData(
            new Vacation[]
            {
                new Vacation { Id=1, Reason="Отпуск", StartDate=new DateTime(2020, 05, 07), EndDate=new DateTime(2020, 05, 15), PersonId=1},
                new Vacation { Id=2, Reason="Отпуск", StartDate=new DateTime(2020, 06, 04), EndDate=new DateTime(2020, 06, 15), PersonId=1},
                new Vacation { Id=3, Reason="Отпуск", StartDate=new DateTime(2020, 05, 16), EndDate=new DateTime(2020, 05, 20), PersonId=3}
            });
        }
    }
}
