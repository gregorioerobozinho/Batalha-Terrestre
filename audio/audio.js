// Batalha Terrestre — áudio do jogo
// Coloque a pasta "audio" dentro da pasta pública do aplicativo.
// Os sons são originais e podem ser substituídos mantendo estes nomes.

const audioFiles = {
  air: "audio/movimento_aviao_drone.wav",
  tank: "audio/movimento_tanque.wav",
  patrol: "audio/movimento_patrulha.wav",
  explosion: "audio/explosao.wav",
  music: "audio/trilha_partida_loop.wav"
};

class BatalhaAudio {
  constructor() {
    this.music = new Audio(audioFiles.music);
    this.music.loop = true;
    this.music.volume = 0.22;
    this.activeMovement = new Map();
  }

  // Navegadores móveis normalmente exigem o primeiro toque do usuário
  // antes de permitir áudio. Chame startMusic() no primeiro botão/toque
  // da tela inicial; depois a trilha segue em loop durante a partida.
  async startMusic() {
    try {
      await this.music.play();
    } catch (err) {
      console.info("Aguardando interação do usuário para iniciar a música.", err);
    }
  }

  stopMusic() {
    this.music.pause();
    this.music.currentTime = 0;
  }

  playEffect(file, volume = 0.75) {
    const sound = new Audio(file);
    sound.volume = volume;
    sound.play().catch(err => console.info("Áudio aguardando interação.", err));
    return sound;
  }

  playAirMovement() {
    return this.playEffect(audioFiles.air, 0.55);
  }

  playTankMovement() {
    return this.playEffect(audioFiles.tank, 0.65);
  }

  playPatrolMovement() {
    return this.playEffect(audioFiles.patrol, 0.60);
  }

  playExplosion() {
    return this.playEffect(audioFiles.explosion, 0.8);
  }
}

export const gameAudio = new BatalhaAudio();
