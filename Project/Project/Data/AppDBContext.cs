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
                new Person { Id=1, Name="Половцев Эдуард Агапович", Position="Разработчик", Duty=true, TeamId=1, Coefficient=1.55, Hours=0},
                new Person { Id=2, Name="Яндульский Иван Кондратьевич", Position="Разработчик", Duty=true, TeamId=1, Coefficient=1, Hours=0},
                new Person { Id=3, Name="Иванов Иван Иванович", Position="Разработчик", Duty=true, TeamId=1, Coefficient=1, Hours=0},
                new Person { Id=4, Name="Янович Руслан Савелиевич", Position="Тестировщик", Duty=false, TeamId=1, Coefficient=1, Hours=0},
                new Person { Id=5, Name="Циркунов Руслан Олегович", Position="Тестировщик", Duty=true, TeamId=1, Coefficient=1, Hours=0},
                new Person { Id=6, Name="Арефьев Захар Пахомович", Position="Тестировщик", Duty=false, TeamId=2, Coefficient=1, Hours=0},
                new Person { Id=7, Name="Яробкин Феликс Куприянович", Position="Разработчик", Duty=false, TeamId=2, Coefficient=1, Hours=0},
                new Person { Id=8, Name="Ковалев Мстислав Маркович", Position="Тестировщик", Duty=false, TeamId=3, Coefficient=1, Hours=0}
            });
        }
    }
}
