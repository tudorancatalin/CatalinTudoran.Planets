using Newtonsoft.Json;
using CatalinTudoran.Planets.Services;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CatalinTudoran.Planets
{
    public class Tokens
    {
        public static async Task<string> GenerateJwt(ClaimsIdentity identity,
           IJwtFactory jwtFactory,
           string userName,
           JwtIssuerOptions jwtOptions,
           JsonSerializerSettings serializerSettings)
        {
            var response = new
            {
                id = identity.Claims.Single(c => c.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value,
                auth_token = await jwtFactory.GenerateEncodedToken(userName, identity),
                expires_in = (int)jwtOptions.ValidFor.TotalSeconds,
                isCaptain = identity.Claims.Any(c => c.Type == Constants.Strings.JwtClaimIdentifiers.Rol
                    && c.Value == Constants.Strings.JwtClaims.CaptainRole)
            };

            return JsonConvert.SerializeObject(response, serializerSettings);
        }
    }
}
