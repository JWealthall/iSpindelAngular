using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iSpindelAngular.Models;
using Microsoft.EntityFrameworkCore;

namespace iSpindelAngular.Data
{
    public class LogDbContext : DbContext
    {
        public LogDbContext() { }   // Allow a null as will use a default
        public LogDbContext(DbContextOptions<LogDbContext> options) : base(options) { }

        public DbSet<Device> Devices { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<Log> Logs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }
    }
}
