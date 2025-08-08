-- scripts/articles-schema.sql
-- Creates an articles table for MDX content or a compatibility view mapping to existing docs_articles

-- If docs_articles already exists, create a view named articles to avoid duplication
DO $outer$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'docs_articles'
  ) THEN
    -- Create a view to satisfy code expectations without duplicating data
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.views 
      WHERE table_schema = 'public' AND table_name = 'articles'
    ) THEN
      EXECUTE $view$
        CREATE VIEW public.articles AS
        SELECT
          id,
          slug,
          title,
          NULL::text AS description,
          content,
          category,
          subcategory,
          collection,
          tags,
          visibility,
          created_at,
          updated_at,
          created_by_user_id,
          NULL::text AS author_name,
          NULL::text AS author_role,
          NULL::text AS author_image
        FROM public.docs_articles
      $view$;
    END IF;
  ELSE
    -- Create a dedicated articles table with MDX content storage
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'articles'
    ) THEN
      CREATE TABLE public.articles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        slug text UNIQUE NOT NULL,
        title text NOT NULL,
        description text,
        content text, -- MDX string
        category text,
        subcategory text,
        collection text,
        tags text[],
        visibility text DEFAULT 'public',
        author_name text,
        author_role text,
        author_image text,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        created_by_user_id uuid
      );
      CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles (slug);
      CREATE INDEX IF NOT EXISTS articles_visibility_idx ON public.articles (visibility);
    END IF;
  END IF;
END$outer$;

-- Optional RLS policies (only apply if articles is a BASE TABLE)
DO $rls$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'articles' AND table_type = 'BASE TABLE'
  ) THEN
    EXECUTE 'ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY';

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'articles' AND policyname = 'Allow read to all'
    ) THEN
      CREATE POLICY "Allow read to all" ON public.articles FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'articles' AND policyname = 'Allow writes to authenticated'
    ) THEN
      CREATE POLICY "Allow writes to authenticated" ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
  END IF;
END$rls$;

