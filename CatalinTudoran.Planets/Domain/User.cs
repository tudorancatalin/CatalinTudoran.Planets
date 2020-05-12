using Microsoft.AspNetCore.Identity;

namespace CatalinTudoran.Planets.Domain
{
    public class User : IdentityUser
    {
        public bool IsAvailable { get; set; }

        public string Name { get; set; }
    }
}
