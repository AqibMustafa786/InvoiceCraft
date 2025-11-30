import { cn } from '@/lib/utils';

const Marquee = () => {
  const slogans = [
    'From Hustle to Paid, Seamlessly.',
    'Your Work, Billed Beautifully.',
    'Crafting Clarity in Every Invoice.',
    'Effortless Invoicing, Elevated.',
  ];

  const repeatedSlogans = Array(4).fill(slogans).flat();

  return (
    <div className="relative flex w-full overflow-x-hidden">
      <div className="py-4 animate-marquee whitespace-nowrap flex">
        {repeatedSlogans.map((slogan, index) => (
          <span
            key={index}
            className={cn(
              'mx-4 text-xl font-semibold',
              index % 2 === 0 ? 'text-muted-foreground' : 'text-foreground'
            )}
          >
            {slogan}
          </span>
        ))}
      </div>

       <div className="absolute top-0 py-4 animate-marquee-cont whitespace-nowrap flex">
        {repeatedSlogans.map((slogan, index) => (
          <span
            key={index}
            className={cn(
              'mx-4 text-xl font-semibold',
              index % 2 === 0 ? 'text-muted-foreground' : 'text-foreground'
            )}
          >
            {slogan}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
