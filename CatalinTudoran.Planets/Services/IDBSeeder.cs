using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalinTudoran.Planets.Services
{
    public interface IDBSeeder
    {
        Task EnsureInitialData();
    }
}
