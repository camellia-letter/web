import { Paper, Box } from "@mantine/core";
import { useTheme } from "@/contexts/ThemeContext";

interface HeroBlockProps {
  data: {
    imageUrl: string;
    altText?: string;
  };
}

export const HeroBlock = ({ data }: HeroBlockProps) => {
  const { colors } = useTheme();

  if (!data.imageUrl) return null;

  return (
    <Box
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      <Paper
        radius={0}
        style={{
          position: 'relative',
          width: '425px',
          maxWidth: '100%',
          backgroundColor: colors.background,
          touchAction: 'pan-y',
        }}
      >
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            touchAction: 'pan-y',
          }}
        >
          <img
            src={data.imageUrl}
            alt={data.altText || '메인 이미지'}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none',
              touchAction: 'none',
            }}
            draggable={false}
          />
        </Box>
      </Paper>
    </Box>
  );
};
