using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalinTudoran.Planets.Domain
{
    public class ExplorersTeam
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public Captain Captain { get; set; }

        public List<Robot> Robots { get; set; }
    }
}