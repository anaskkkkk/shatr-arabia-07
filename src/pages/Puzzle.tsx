import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ChessBoard from "@/components/ChessBoard";
import { 
  Home, 
  Lightbulb, 
  Eye, 
  SkipForward, 
  RotateCcw, 
  Clock, 
  Trophy, 
  Target,
  Star,
  Crown
} from "lucide-react";

const Puzzle = () => {
  const { toast } = useToast();
  const [currentPuzzle, setCurrentPuzzle] = useState<any>(null);
  const [difficulty, setDifficulty] = useState("متوسط");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Mock puzzle data
  const mockPuzzle = {
    id: "daily_001",
    title: "تكتيك الدبوس",
    difficulty: "متوسط",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    solution: ["e2e4", "e7e5", "Nf3"],
    targetSquare: "e4",
    description: "احم الملكة وهاجم في نفس الوقت",
    points: 10,
    category: "تكتيك"
  };

  useEffect(() => {
    loadDailyPuzzle();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && currentPuzzle && !showSolution) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, currentPuzzle, showSolution]);

  const loadDailyPuzzle = async () => {
    setIsLoading(true);
    try {
      // REST: GET /api/puzzles/daily -> fetch daily puzzle
      // Mock response:
      setCurrentPuzzle(mockPuzzle);
      setTimeLeft(300);
      setShowHint(false);
      setShowSolution(false);
      setHintsUsed(0);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "لم نتمكن من تحميل اللغز. حاول مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPuzzleByDifficulty = async (diff: string) => {
    setDifficulty(diff);
    setIsLoading(true);
    try {
      // REST: GET /api/puzzles?difficulty=${diff} -> fetch puzzle by difficulty
      setCurrentPuzzle(mockPuzzle);
      setTimeLeft(300);
      setShowHint(false);
      setShowSolution(false);
      setHintsUsed(0);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "لم نتمكن من تحميل اللغز. حاول مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showHintAction = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
    toast({
      title: "تلميح",
      description: "انظر إلى المربع المضيء - هناك تكتيك قوي!"
    });
  };

  const revealSolution = () => {
    setShowSolution(true);
    toast({
      title: "الحل",
      description: "تم عرض الحل. ادرس الحركات بعناية!"
    });
  };

  const submitSolution = async (moves: string[]) => {
    // REST: POST /api/puzzles/${currentPuzzle.id}/solve -> submit solution
    const timeUsed = 300 - timeLeft;
    const pointsEarned = Math.max(1, currentPuzzle.points - hintsUsed * 2);
    
    setScore(score + pointsEarned);
    toast({
      title: "أحسنت!",
      description: `حصلت على ${pointsEarned} نقطة في ${timeUsed} ثانية`
    });
  };

  const nextPuzzle = () => {
    loadDailyPuzzle();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "سهل": return "text-green-500";
      case "صعب": return "text-red-500";
      default: return "text-yellow-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground font-cairo">الألغاز التكتيكية</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="font-medium">{score} نقطة</span>
              </div>
              <Select value={difficulty} onValueChange={loadPuzzleByDifficulty}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="سهل">سهل</SelectItem>
                  <SelectItem value="متوسط">متوسط</SelectItem>
                  <SelectItem value="صعب">صعب</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground">جاري تحميل اللغز...</p>
            </div>
          </div>
        ) : currentPuzzle ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Puzzle Board */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="aspect-square max-w-lg mx-auto">
                  <ChessBoard
                    initialFen={currentPuzzle.fen}
                    onMove={(move) => {
                      // Check if move is correct
                      console.log("Move made:", move);
                      // For demo purposes, any move "solves" the puzzle
                      submitSolution([move]);
                    }}
                    showHighlights={showHint}
                    targetSquare={showHint ? currentPuzzle.targetSquare : undefined}
                  />
                </div>

                {/* Solution Moves */}
                {showSolution && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 font-cairo">الحل:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPuzzle.solution.map((move: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {index + 1}. {move}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              {/* Puzzle Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-cairo">{currentPuzzle.title}</CardTitle>
                    <Badge className={getDifficultyColor(currentPuzzle.difficulty)}>
                      {currentPuzzle.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{currentPuzzle.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">الوقت المتبقي</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">النقاط</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{currentPuzzle.points - hintsUsed * 2}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">التلميحات المستخدمة</span>
                    <span>{hintsUsed}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Button 
                    onClick={showHintAction}
                    disabled={showHint}
                    variant="elegant"
                    className="w-full"
                  >
                    <Lightbulb className="ml-2 h-4 w-4" />
                    {showHint ? "تم عرض التلميح" : "تلميح"}
                  </Button>

                  <Button 
                    onClick={revealSolution}
                    disabled={showSolution}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="ml-2 h-4 w-4" />
                    {showSolution ? "تم عرض الحل" : "عرض الحل"}
                  </Button>

                  <Separator />

                  <Button onClick={nextPuzzle} variant="chess" className="w-full">
                    <SkipForward className="ml-2 h-4 w-4" />
                    اللغز التالي
                  </Button>

                  <Button onClick={loadDailyPuzzle} variant="ghost" className="w-full">
                    <RotateCcw className="ml-2 h-4 w-4" />
                    إعادة تحميل
                  </Button>
                </CardContent>
              </Card>

              {/* Daily Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-cairo text-lg">إحصائيات اليوم</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">الألغاز المحلولة</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">نسبة النجاح</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">أفضل وقت</span>
                    <span className="font-medium">1:23</span>
                  </div>
                </CardContent>
              </Card>

              {/* Leaderboard Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-cairo text-lg">المتصدرون اليوم</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: "أحمد محمد", score: 150, rank: 1 },
                    { name: "سارة أحمد", score: 120, rank: 2 },
                    { name: "محمد علي", score: 95, rank: 3 }
                  ].map((player) => (
                    <div key={player.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-primary" />
                        <span className="text-sm">{player.name}</span>
                      </div>
                      <span className="text-sm font-medium">{player.score}</span>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    عرض الترتيب الكامل
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 font-cairo">لا توجد ألغاز متاحة</h3>
            <p className="text-muted-foreground mb-4">حاول تحديث الصفحة أو اختر صعوبة مختلفة</p>
            <Button onClick={loadDailyPuzzle} variant="chess">
              تحميل لغز جديد
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Puzzle;