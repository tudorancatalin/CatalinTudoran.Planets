using System.Security.Claims;

namespace CatalinTudoran.Planets
{
    public class Constants
    {
        public static class Strings
        {
            public static class Roles
            {
                public const string Captain = "Captain";
            }

            public static class JwtClaimIdentifiers
            {
                public const string Rol = "rol";
                public const string Id = ClaimTypes.NameIdentifier;
            }

            public static class JwtClaims
            {
                public const string RobotRole = "robot";
                public const string CaptainRole = "captain";
            }
        }
    }
}
